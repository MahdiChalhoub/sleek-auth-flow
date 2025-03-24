
import React, { useState, useEffect, useRef } from "react";
import { DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScanLine, Camera, Smartphone } from "lucide-react";

interface BarcodeScannerModalProps {
  onScan: (barcode: string) => void;
  onClose: () => void;
}

const BarcodeScannerModal: React.FC<BarcodeScannerModalProps> = ({ onScan, onClose }) => {
  const [barcode, setBarcode] = useState("");
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Auto-focus the input when modal opens
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (barcode.trim()) {
      onScan(barcode);
    }
  };

  const toggleCamera = async () => {
    if (isCameraActive) {
      // Stop the camera
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
      setIsCameraActive(false);
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
          
          // In a real application, you would implement barcode scanning here
          // For demonstration purposes, we'll just simulate a scan after 3 seconds
          setTimeout(() => {
            const demoBarcode = "9781234567897";
            setBarcode(demoBarcode);
            if (inputRef.current) {
              inputRef.current.focus();
            }
            
            // Stop the camera after simulated scan
            stream.getTracks().forEach(track => track.stop());
            if (videoRef.current) videoRef.current.srcObject = null;
            setIsCameraActive(false);
          }, 3000);
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        alert("Unable to access camera. Please check permissions or enter barcode manually.");
      }
    }
  };

  return (
    <DialogContent className="sm:max-w-[500px]">
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
          <div className="relative rounded-md overflow-hidden border aspect-video bg-muted flex items-center justify-center">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              className="w-full h-full object-cover"
            />
            <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full hidden" />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-3/4 h-1/2 border-2 border-primary/50 rounded-md flex items-center justify-center">
                <span className="text-xs bg-background/80 text-foreground p-1 rounded">
                  Align barcode in frame
                </span>
              </div>
            </div>
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
                className="flex-1"
              />
              <Button 
                type="button" 
                variant="outline" 
                onClick={toggleCamera}
                className="flex-shrink-0"
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        <div className="bg-muted/30 p-4 rounded-md border">
          <h4 className="text-sm font-medium mb-2">Scanning Options</h4>
          <div className="grid grid-cols-2 gap-2">
            <Button 
              type="button" 
              variant="outline" 
              className="flex items-center justify-start gap-2 h-auto py-3" 
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
              className="flex items-center justify-start gap-2 h-auto py-3" 
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
            <p>Tip: Use keyboard shortcut Alt+B to quickly open barcode scanner from any screen.</p>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={!barcode.trim()}>
            Confirm
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

export default BarcodeScannerModal;
