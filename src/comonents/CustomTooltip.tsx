import * as Tooltip from '@radix-ui/react-tooltip';
import { CustomTooltipProps } from '../interfaces';

const CustomTooltip = ({ title, children }: CustomTooltipProps) => {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content className="TooltipContent" sideOffset={4}>
          {title}
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
};

export default CustomTooltip;
