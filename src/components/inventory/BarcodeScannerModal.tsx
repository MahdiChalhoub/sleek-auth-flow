
import React, { useState, useRef, useEffect } from 'react';
import { X, Scan, AlertCircle } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useNavigate } from 'react-router-dom';

interface BarcodeScannerModalProps {
  onScan: (barcode: string) => void;
  onClose: () => void;
}

const BarcodeScannerModal: React.FC<BarcodeScannerModalProps> = ({ onScan, onClose }) => {
  const navigate = useNavigate();
  const [barcode, setBarcode] = useState('');
  const [scanMode, setScanMode] = useState<'camera' | 'manual'>('manual');
  const [error, setError] = useState<string | null>(null);
  
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus the input when the modal opens
    if (scanMode === 'manual' && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
    
    // Add escape key handler to close the modal
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [scanMode, onClose]);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (barcode.trim()) {
      onScan(barcode.trim());
    } else {
      setError('Veuillez entrer un code-barres');
    }
  };

  return (
    <Sheet open={true} onOpenChange={() => onClose()}>
      <SheetContent side="bottom" className="h-[80vh] sm:h-[400px] sm:max-w-md sm:rounded-t-lg sm:mx-auto">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle className="text-center">Scanner un Code-barres</SheetTitle>
            <Button variant="ghost" size="icon" onClick={onClose} className="absolute right-4 top-4">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>
        
        <div className="space-y-4 py-4 flex flex-col h-full">
          <div className="flex gap-2 justify-center">
            <Button
              variant={scanMode === 'manual' ? 'default' : 'outline'}
              onClick={() => setScanMode('manual')}
              className="flex-1"
            >
              Manuel
            </Button>
            <Button
              variant={scanMode === 'camera' ? 'default' : 'outline'}
              onClick={() => setScanMode('camera')}
              className="flex-1"
              disabled
            >
              Caméra
            </Button>
          </div>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {scanMode === 'manual' ? (
            <form onSubmit={handleManualSubmit} className="space-y-4 flex-1 flex flex-col">
              <div className="space-y-2 flex-1">
                <Label htmlFor="barcode">Code-barres</Label>
                <Input
                  id="barcode"
                  placeholder="Entrez le code-barres manuellement"
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                  ref={inputRef}
                  autoComplete="off"
                />
              </div>
              
              <SheetFooter className="sm:justify-center">
                <Button type="button" variant="outline" onClick={onClose}>
                  Annuler
                </Button>
                <Button type="submit">
                  <Scan className="h-4 w-4 mr-2" />
                  Valider
                </Button>
              </SheetFooter>
            </form>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-4 flex-1">
              <div className="border-2 border-dashed border-gray-300 rounded-lg h-48 w-full max-w-xs flex items-center justify-center bg-gray-50">
                <div className="text-center text-muted-foreground">
                  <Scan className="h-10 w-10 mx-auto mb-2 opacity-50" />
                  <p>La numérisation par caméra n'est pas disponible</p>
                </div>
              </div>
              
              <SheetFooter className="sm:justify-center">
                <Button variant="outline" onClick={onClose}>
                  Annuler
                </Button>
              </SheetFooter>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default BarcodeScannerModal;
