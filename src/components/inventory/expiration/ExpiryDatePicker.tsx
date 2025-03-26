
import React from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format, addMonths } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ExpiryDatePickerProps {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
}

const ExpiryDatePicker: React.FC<ExpiryDatePickerProps> = ({ value, onChange }) => {
  const today = new Date();
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start text-left font-normal"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, 'PPP', { locale: fr }) : "Sélectionner la date d'expiration"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
          initialFocus
          disabled={(date) => date < today}
          fromDate={today}
          toDate={addMonths(today, 36)} // Allow selecting dates up to 3 years in the future
        />
      </PopoverContent>
    </Popover>
  );
};

export default ExpiryDatePicker;
