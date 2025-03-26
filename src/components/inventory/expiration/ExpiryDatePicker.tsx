
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export interface ExpiryDatePickerProps {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  disabled?: boolean;
}

const ExpiryDatePicker: React.FC<ExpiryDatePickerProps> = ({ 
  value, 
  onChange, 
  disabled = false 
}) => {
  const [date, setDate] = useState<Date | undefined>(value);

  const handleSelect = (newDate: Date | undefined) => {
    setDate(newDate);
    onChange(newDate);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          disabled={disabled}
          className={`w-full justify-start text-left font-normal ${!date && "text-muted-foreground"}`}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : "Select expiry date"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};

export default ExpiryDatePicker;
