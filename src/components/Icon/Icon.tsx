import type { ComponentType, SVGProps } from 'react';
import * as Icons from '../Icon/icons';

type IconName = keyof typeof Icons;

interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'name'> {
  name: IconName;
  size?: number | string;
}

export const Icon = ({ name, size = 24, ...props }: IconProps) => {
  const SVGIcon = Icons[name] as ComponentType<SVGProps<SVGSVGElement>>;

  if (!SVGIcon) {
    console.warn(`Icon "${String(name)}" not found`);
    return null;
  }

  return <SVGIcon width={size} height={size} {...props} />;
};