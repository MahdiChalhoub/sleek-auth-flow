
import React from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';

export interface ExpiryDatePickerProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
}

const ExpiryDatePicker: React.FC<ExpiryDatePickerProps> = ({ selectedDate, onDateChange }) => {
  const date = selectedDate ? parseISO(selectedDate) : new Date();
  
  const handleDateSelect = (newDate: Date | undefined) => {
    if (newDate) {
      onDateChange(newDate.toISOString());
    }
  };
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !selectedDate && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selectedDate ? format(date, "PPP") : "Select a date"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};

export default ExpiryDatePicker;
