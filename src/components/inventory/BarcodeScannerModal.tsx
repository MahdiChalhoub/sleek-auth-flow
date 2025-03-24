
import React, { useState, useEffect, useRef } from "react";
import { DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScanLine, Camera, Smartphone, XCircle } from "lucide-react";

interface BarcodeScannerModalProps {
  onScan: (barcode: string) => void;
  onClose: () => void;
}

const BarcodeScannerModal: React.FC<BarcodeScannerModalProps> = ({ onScan, onClose }) => {
  const [barcode, setBarcode] = useState("");
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [scanLine, setScanLine] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scanIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    // Auto-focus the input when modal opens
    if (inputRef.current) {
      inputRef.current.focus();
    }

    // Cleanup camera on unmount
    return () => {
      if (scanIntervalRef.current) {
        window.clearInterval(scanIntervalRef.current);
      }
      stopCamera();
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (barcode.trim()) {
      onScan(barcode);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
    if (scanIntervalRef.current) {
      window.clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
  };

  const toggleCamera = async () => {
    if (isCameraActive) {
      stopCamera();
    } else {
      // Start the camera
      try {
        const constraints = {
          video: {
            facingMode: "environment" // Use back camera if available
          }
        };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsCameraActive(true);
          
          // Animate scan line
          let position = 0;
          const direction = 1;
          scanIntervalRef.current = window.setInterval(() => {
            position += direction;
            if (position > 100) position = 0;
            setScanLine(position);
          }, 20);
          
          // In a real application, you would implement barcode scanning here
          // For demonstration purposes, we'll just simulate a scan after 3 seconds
          setTimeout(() => {
            const demoBarcode = "9781234567897";
            setBarcode(demoBarcode);
            if (inputRef.current) {
              inputRef.current.focus();
            }
            
            // Stop the camera after simulated scan
            stopCamera();
          }, 3000);
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        alert("Unable to access camera. Please check permissions or enter barcode manually.");
      }
    }
  };

  return (
    <DialogContent className="sm:max-w-[500px] bg-white/90 backdrop-blur-md border-slate-200/70 shadow-xl rounded-xl">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <ScanLine className="h-5 w-5" />
          Scan Barcode
        </DialogTitle>
        <DialogDescription>
          Scan a product barcode or enter it manually to add to purchase order.
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-6 py-4">
        {isCameraActive ? (
          <div className="relative rounded-lg overflow-hidden border border-slate-200/70 aspect-video bg-black flex items-center justify-center">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              className="w-full h-full object-cover"
            />
            <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full hidden" />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-3/4 h-1/2 border-2 border-white/50 rounded-md flex items-center justify-center">
                <span className="text-xs bg-black/50 text-white p-1.5 rounded">
                  Align barcode in frame
                </span>
              </div>
              <div 
                className="absolute left-0 right-0 h-0.5 bg-red-500" 
                style={{ top: `${scanLine}%`, boxShadow: '0 0 10px #ef4444' }}
              />
            </div>
            <Button 
              type="button" 
              variant="secondary" 
              size="icon" 
              className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 rounded-full" 
              onClick={stopCamera}
            >
              <XCircle className="h-5 w-5 text-white" />
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <Label htmlFor="barcode">Barcode</Label>
            <div className="flex gap-2">
              <Input
                id="barcode"
                ref={inputRef}
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                placeholder="Enter or scan barcode"
                pattern="[0-9]*"
                autoComplete="off"
                className="flex-1 bg-white/80 border-slate-200"
              />
              <Button 
                type="button" 
                variant="outline" 
                onClick={toggleCamera}
                className="flex-shrink-0 bg-white/80 border-slate-200"
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        <div className="bg-slate-50/80 p-4 rounded-lg border border-slate-200/70">
          <h4 className="text-sm font-medium mb-2">Scanning Options</h4>
          <div className="grid grid-cols-2 gap-2">
            <Button 
              type="button" 
              variant="outline" 
              className="flex items-center justify-start gap-2 h-auto py-3 bg-white/80" 
              onClick={toggleCamera}
            >
              <Camera className="h-4 w-4" />
              <div className="text-left">
                <div className="font-medium">Camera Scan</div>
                <div className="text-xs text-muted-foreground">Use device camera</div>
              </div>
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              className="flex items-center justify-start gap-2 h-auto py-3 bg-white/80" 
              disabled
            >
              <Smartphone className="h-4 w-4" />
              <div className="text-left">
                <div className="font-medium">Mobile Scan</div>
                <div className="text-xs text-muted-foreground">Use connected device</div>
              </div>
            </Button>
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            <p>Tip: Use keyboard shortcut <kbd className="px-1.5 py-0.5 text-xs rounded bg-slate-100">Alt+B</kbd> to quickly open barcode scanner from any screen.</p>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose} className="bg-white/80">
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={!barcode.trim()} 
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
          >
            Confirm
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

export default BarcodeScannerModal;
