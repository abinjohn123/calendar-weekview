import * as Tooltip from '@radix-ui/react-tooltip';
import { ReactNode } from 'react';

interface CustomTooltipProps {
  title: string;
  children: ReactNode;
}

const CustomTooltip = ({ title, children }: CustomTooltipProps) => {
  return (
    <Tooltip.Provider>
      <Tooltip.Root delayDuration={500}>
        <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content className="TooltipContent" sideOffset={4}>
            {title}
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};

export default CustomTooltip;
