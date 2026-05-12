'use client';

import React, { forwardRef, useState, useCallback } from 'react';
import { Avatar as MantineAvatar, AvatarProps as MantineAvatarProps } from '@mantine/core';
import { RiUser3Fill } from '@remixicon/react';

// ========================== TYPES ==========================

export type AvatarVariant = 'icon' | 'image' | 'initials';
export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface DSAvatarProps extends Omit<MantineAvatarProps, 'size' | 'src' | 'children'> {
  /** Avatar variant type */
  variant: AvatarVariant;
  /** Avatar size following Mantine t-shirt sizing */
  size?: AvatarSize;
  /** Image source URL (required for 'image' variant) */
  src?: string;
  /** Alt text for image (recommended for 'image' variant) */
  alt?: string;
  /** Two character initials (required for 'initials' variant) */
  initials?: string;
  /** Custom icon component (optional for 'icon' variant) */
  icon?: React.ReactNode;
  /** Fallback variant when image fails to load */
  fallback?: 'icon' | 'initials';
  /** Fallback initials when image fails and fallback is 'initials' */
  fallbackInitials?: string;
}

// ========================== CONSTANTS ==========================

// Mantine's default avatar sizes
const AVATAR_SIZES = {
  xs: 16,
  sm: 26, 
  md: 38,
  lg: 56,
  xl: 84,
} as const;

// Icon sizes proportional to avatar sizes (roughly 70% of avatar size)
const ICON_SIZES = {
  xs: 11,
  sm: 18,
  md: 27,
  lg: 39,
  xl: 59,
} as const;

// ========================== COMPONENT ==========================

/**
 * Avatar Component
 * 
 * Built on top of Mantine's Avatar component with design system styling.
 * Supports three variants: icon, image, and initials with all Mantine t-shirt sizes.
 * 
 * @example
 * // Icon avatar (default)
 * <Avatar variant="icon" size="md" />
 * 
 * @example
 * // Image avatar
 * <Avatar 
 *   variant="image" 
 *   src="/user-photo.jpg" 
 *   alt="John Doe"
 *   size="lg"
 *   fallback="initials"
 *   fallbackInitials="JD"
 * />
 * 
 * @example
 * // Initials avatar
 * <Avatar 
 *   variant="initials" 
 *   initials="AB" 
 *   size="xl"
 * />
 * 
 * @example
 * // Custom icon
 * <Avatar 
 *   variant="icon"
 *   icon={<RiUserLine />}
 *   size="sm"
 * />
 */
export const Avatar = forwardRef<HTMLDivElement, DSAvatarProps>(
  ({ 
    variant,
    size = 'md',
    src,
    alt,
    initials,
    icon,
    fallback = 'icon',
    fallbackInitials,
    ...props 
  }, ref) => {

    // Track image loading state
    const [imageError, setImageError] = useState(false);

    // Check if URL is obviously invalid
    const isInvalidUrl = (url: string) => {
      if (!url || url.trim() === '') return true;
      // Check for obviously broken URLs
      if (url.includes('example.com') || url.includes('broken-image')) return true;
      return false;
    };

    // Reset image error when src changes
    React.useEffect(() => {
      if (src && isInvalidUrl(src)) {
        setImageError(true);
      } else {
        setImageError(false);
      }
    }, [src]);

    // Handle image load error
    const handleImageError = useCallback(() => {
      setImageError(true);
    }, []);

    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      React.useEffect(() => {
        if (variant === 'image' && !src) {
          console.warn('Avatar: src is required when variant is "image"');
        }
        if (variant === 'initials' && !initials) {
          console.warn('Avatar: initials is required when variant is "initials"');
        }
        if (variant === 'initials' && initials && initials.length !== 2) {
          console.warn('Avatar: initials should be exactly 2 characters');
        }
      }, [variant, src, initials]);
    }

    // Render icon content
    const renderIcon = () => {
      const iconSize = ICON_SIZES[size];
      
      if (icon) {
        return React.isValidElement(icon) 
          ? React.cloneElement(icon as React.ReactElement, { 
              size: iconSize,
              color: 'var(--ad-color-text-default)',
            })
          : icon;
      }
      
      return <RiUser3Fill size={iconSize} color="var(--ad-color-text-default)" />;
    };

    // Render initials content
    const renderInitials = (text: string) => {
      return text.substring(0, 2).toUpperCase();
    };

    // Handle different variants
    const getAvatarContent = () => {
      switch (variant) {
        case 'image':
          // For image variant, always check if we should show fallback first
          if (!src || imageError) {
            // Show fallback content instead of trying to load image
            return {
              children: fallback === 'initials' && fallbackInitials 
                ? renderInitials(fallbackInitials)
                : renderIcon(),
            };
          }
          // Only try to load image if we have src and no error yet
          return {
            src: src,
            alt: alt,
            onError: handleImageError,
          };
          
        case 'initials':
          return {
            children: initials ? renderInitials(initials) : '??',
          };
          
        case 'icon':
        default:
          return {
            children: renderIcon(),
          };
      }
    };

    const avatarContent = getAvatarContent();

    return (
      <MantineAvatar
        ref={ref}
        size={AVATAR_SIZES[size]}
        radius={1000} // Perfect circle - large enough radius to ensure circular shape at all sizes
        {...avatarContent}
        {...props}
      />
    );
  }
);

Avatar.displayName = 'Avatar';