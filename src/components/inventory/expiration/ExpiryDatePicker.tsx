
import React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface ExpiryDatePickerProps {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
}

const ExpiryDatePicker: React.FC<ExpiryDatePickerProps> = ({ value, onChange }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, 'PPP', { locale: fr }) : <span>Sélectionnez une date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
          locale={fr}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};

export default ExpiryDatePicker;
