/**
 * Input avec validation visuelle (checkmark vert)
 * Composant réutilisable pour afficher un input avec icône de validation
 */
import type { InputProps } from './ui/input';
interface ValidatedInputProps extends InputProps {
    showCheckmark?: boolean;
}
export declare const ValidatedInput: ({ showCheckmark, className, ...props }: ValidatedInputProps) => import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=validated-input.d.ts.map