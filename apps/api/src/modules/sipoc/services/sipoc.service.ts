import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { SipocDiagramRepository } from '../repositories/sipoc-diagram.repository';
import { SipocElementRepository } from '../repositories/sipoc-element.repository';
import { SipocConnectionRepository } from '../repositories/sipoc-connection.repository';
import { CreateSipocDto } from '../dto/create-sipoc.dto';
import { UpdateSipocDto } from '../dto/update-sipoc.dto';
import { CreateElementDto } from '../dto/create-element.dto';
import { UpdateElementDto } from '../dto/update-element.dto';
import { ReorderElementsDto } from '../dto/reorder-elements.dto';
import { CreateConnectionDto } from '../dto/create-connection.dto';
import { SipocDiagram, SipocElement, SipocConnection } from '../entities/sipoc.entity';

@Injectable()
export class SipocService {
  constructor(
    private readonly sipocDiagramRepository: SipocDiagramRepository,
    private readonly sipocElementRepository: SipocElementRepository,
    private readonly sipocConnectionRepository: SipocConnectionRepository,
  ) {}

  // SIPOC Diagram Operations
  async findAllDiagrams(userId: string, filters?: {
    status?: string;
    processId?: string;
  }): Promise<SipocDiagram[]> {
    return this.sipocDiagramRepository.findAll({
      ...filters,
      createdBy: userId,
    });
  }

  async findDiagramById(sipoc_id: string): Promise<SipocDiagram> {
    
    const diagram = await this.sipocDiagramRepository.findById(sipoc_id);
    if (!diagram) {
      throw new NotFoundException(`SIPOC diagram with ID ${sipoc_id} not found`);
    }
    return diagram;
  }

  async findDiagramsByProcessId(processId: string): Promise<SipocDiagram> {
    return this.sipocDiagramRepository.findByProcessId(processId);
  }

  async createDiagram(
    createSipocDto: CreateSipocDto,
    userId: string,
  ): Promise<SipocDiagram> {
    return this.sipocDiagramRepository.create({
      ...createSipocDto,
      createdBy: userId,
    });
  }

  async updateDiagram(
    sipoc_id: string,
    updateSipocDto: UpdateSipocDto,
  ): Promise<SipocDiagram> {
    await this.findDiagramById(sipoc_id);
    return this.sipocDiagramRepository.update(sipoc_id, updateSipocDto);
  }

  async deleteDiagram(sipoc_id: string): Promise<void> {
    await this.findDiagramById(sipoc_id);
    await this.sipocDiagramRepository.delete(sipoc_id);
  }

  // Element Operations
  async findElements(sipoc_id: string): Promise<SipocElement[]> {
    return this.sipocElementRepository.findBySipocId(sipoc_id);
  }

  async createElement(
    createElementDto: CreateElementDto,
  ): Promise<SipocElement> {
    return this.sipocElementRepository.create(createElementDto);
  }

  async updateElement(
    id: string,
    updateElementDto: UpdateElementDto,
  ): Promise<SipocElement> {
    const element = await this.sipocElementRepository.findById(id);
    if (!element) {
      throw new NotFoundException(`Element with ID ${id} not found`);
    }
    return this.sipocElementRepository.update(id, updateElementDto);
  }

  async deleteElement(id: string): Promise<void> {
    const element = await this.sipocElementRepository.findById(id);
    if (!element) {
      throw new NotFoundException(`Element with ID ${id} not found`);
    }

    // Delete associated connections
    await this.sipocConnectionRepository.deleteByElementId(id);

    // Delete the element
    await this.sipocElementRepository.delete(id);
  }

  /**
   * Find similar SIPOC elements based on title similarity
   * Uses text matching algorithms to suggest related elements
   */
  async findSimilarElements(
    sourceTitle: string,
    currentSipocId: string,
    similarityThreshold: number = 0.3,
  ) {
    // Clean and prepare the search term
    const cleanTitle = sourceTitle.toLowerCase().trim();
    const searchTerms = cleanTitle.split(/\s+/);

    // Find all elements except those in the current version
    const allElements = await this.sipocElementRepository.findAllExcept(
      currentSipocId,
    );

    // Calculate similarity for each element
    const similarElements = allElements
      .map((element) => {
        const similarity = this.calculateTitleSimilarity(
          cleanTitle,
          element.title.toLowerCase().trim(),
          searchTerms,
        );

        return {
          element: {
            id: element.id,
            title: element.title,
            description: element.description,
            type: element.type,
            sipoc_id: element.sipoc_id,
          },
          version: {
            sipoc_id: element.sipoc_id,
            // We'll need to join this data
            title: '', // Will be populated below
          },
          similarityScore: similarity.score,
          matchType: similarity.matchType,
        };
      })
      .filter((item) => item.similarityScore >= similarityThreshold)
      .sort((a, b) => b.similarityScore - a.similarityScore);

    // Note: Version titles would need to be fetched from SipocVersion table
    // This is a simplified version - you may want to enhance this with version data

    return similarElements;
  }

  /**
   * Calculate similarity score between two titles
   */
  private calculateTitleSimilarity(
    sourceTitle: string,
    targetTitle: string,
    searchTerms: string[],
  ): { score: number; matchType: 'exact' | 'contains' | 'partial' | 'word_match' } {
    // Exact match
    if (sourceTitle === targetTitle) {
      return { score: 1.0, matchType: 'exact' };
    }

    // One contains the other
    if (targetTitle.includes(sourceTitle)) {
      return { score: 0.9, matchType: 'contains' };
    }
    if (sourceTitle.includes(targetTitle)) {
      return { score: 0.85, matchType: 'contains' };
    }

    // Word-by-word matching
    const targetWords = targetTitle.split(/\s+/);
    const matchingWords = searchTerms.filter((term) =>
      targetWords.some((word) => word.includes(term) || term.includes(word)),
    );

    if (matchingWords.length > 0) {
      const wordMatchScore = matchingWords.length / searchTerms.length;
      if (wordMatchScore >= 0.5) {
        return { score: wordMatchScore * 0.7, matchType: 'word_match' };
      }
    }

    // Character-level similarity (Levenshtein-like approach)
    const maxLength = Math.max(sourceTitle.length, targetTitle.length);
    let matches = 0;
    const minLength = Math.min(sourceTitle.length, targetTitle.length);

    for (let i = 0; i < minLength; i++) {
      if (sourceTitle[i] === targetTitle[i]) {
        matches++;
      }
    }

    const partialScore = matches / maxLength;
    if (partialScore >= 0.3) {
      return { score: partialScore * 0.6, matchType: 'partial' };
    }

    return { score: 0, matchType: 'partial' };
  }

  async reorderElements(
    sipoc_id: string,
    reorderDto: ReorderElementsDto,
  ): Promise<SipocElement[]> {
    // Validate all elements belong to this version
    const elements = await this.sipocElementRepository.findBySipocId(sipoc_id);
    const elementIds = new Set(elements.map((e) => e.id));

    for (const item of reorderDto.elements) {
      if (!elementIds.has(item.id)) {
        throw new BadRequestException(
          `Element ${item.id} does not belong to sipoc ${sipoc_id}`,
        );
      }
    }

    // Update positions in a transaction
    await this.sipocElementRepository.updateMany(reorderDto.elements);

    // Return updated elements
    return this.sipocElementRepository.findBySipocId(sipoc_id);
  }

  // Connection Operations
  async findConnections(sipoc_id: string): Promise<SipocConnection[]> {
    return this.sipocConnectionRepository.findBySipocId(sipoc_id);
  }

  async createConnection(
    createConnectionDto: CreateConnectionDto,
  ): Promise<SipocConnection> {
    // Validate source and target elements exist
    const sourceElement = await this.sipocElementRepository.findById(
      createConnectionDto.source_element_id,
    );
    const targetElement = await this.sipocElementRepository.findById(
      createConnectionDto.target_element_id,
    );

    if (!sourceElement) {
      throw new NotFoundException(
        `Source element ${createConnectionDto.source_element_id} not found`,
      );
    }
    if (!targetElement) {
      throw new NotFoundException(
        `Target element ${createConnectionDto.target_element_id} not found`,
      );
    }

    return this.sipocConnectionRepository.create(createConnectionDto);
  }

  async deleteConnection(connection_id: string): Promise<void> {
    const connection = await this.sipocConnectionRepository.findById(
      connection_id,
    );
    if (!connection) {
      throw new NotFoundException(
        `Connection with ID ${connection_id} not found`,
      );
    }
    await this.sipocConnectionRepository.delete(connection_id);
  }
}
