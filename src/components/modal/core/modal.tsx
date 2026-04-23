import { useEffect, useRef, useState } from 'react';
import { Box, Flex, Text, Clickable } from '../../core';
import { transition } from '../../../ecosystem/utils/functions';
import type { ModalProps } from '../interfaces';

const sizeMap = {
  sm: '420px',
  md: '560px',
  lg: '720px',
} as const;

export function Modal({
  open,
  title,
  description,
  children,
  footer,
  size = 'md',
  closeLabel = 'Close modal',
  closeOnOverlayClick = true,
  onOpenChange,
}: ModalProps) {
  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(false);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    if (open) {
      setMounted(true);
      frameRef.current = requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
      const t = setTimeout(() => setMounted(false), 200);
      return () => clearTimeout(t);
    }
    return () => cancelAnimationFrame(frameRef.current);
  }, [open]);

  useEffect(() => {
    if (!open || typeof document === 'undefined') return undefined;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onOpenChange?.(false);
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onOpenChange]);

  if (!mounted) return null;

  return (
    <Flex
      role="presentation"
      onClick={() => {
        if (closeOnOverlayClick) onOpenChange?.(false);
      }}
      alignItems="center"
      justifyContent="center"
      position="fixed"
      zIndex="modal"
      padding="medium"
      backgroundColor="background.overlay"
      opacity={visible ? 1 : 0}
      style={{
        inset: 0,
        transition: 'opacity 0.2s ease',
      }}
    >
      <Flex
        role="dialog"
        aria-modal="true"
        aria-label={typeof title === 'string' ? title : undefined}
        onClick={(event: React.MouseEvent) => event.stopPropagation()}
        flexDirection="column"
        gap="small"
        padding="large"
        borderRadius="large"
        backgroundColor="surface.raised"
        width="100%"
        style={{
          maxWidth: sizeMap[size],
          boxShadow: '0 20px 48px rgba(0, 0, 0, 0.16)',
          opacity: visible ? 1 : 0,
          transform: visible ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(-8px)',
          transition: transition(['transform', 'opacity'], 'normal', 'decelerate'),
        }}
      >
        <Flex alignItems="flex-start" justifyContent="space-between" gap="12px">
          <Flex flexDirection="column" gap="6px" style={{ minWidth: 0 }}>
            {title && (
              <Text
                as="h2"
                color="text.primary"
                fontSize="medium"
                style={{ margin: 0 }}
              >
                {title}
              </Text>
            )}
            {description && (
              <Text
                as="p"
                color="text.secondary"
                fontSize="small"
                style={{ margin: 0 }}
              >
                {description}
              </Text>
            )}
          </Flex>
          <Clickable
            as="button"
            type="button"
            aria-label={closeLabel}
            onClick={() => onOpenChange?.(false)}
            color="text.secondary"
            fontSize="medium"
            cursor="pointer"
            backgroundColor="transparent"
            style={{ lineHeight: 1 }}
          >
            ×
          </Clickable>
        </Flex>
        {children && (
          <Box color="text.primary">
            {children}
          </Box>
        )}
        {footer && (
          <Flex justifyContent="flex-end" gap="12px">
            {footer}
          </Flex>
        )}
      </Flex>
    </Flex>
  );
}

export default Modal;
