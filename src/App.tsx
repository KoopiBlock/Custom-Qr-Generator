import React, { useEffect, useRef, useState, ChangeEvent } from "react";
import './App.css';
import QRCodeStyling, {
  DrawType,
  TypeNumber,
  Mode,
  ErrorCorrectionLevel,
  DotType,
  CornerSquareType,
  CornerDotType,
  Extension,
  Options
} from "qr-code-styling";
import { read } from "fs";

export default function App() {
  
  const [options, setOptions] = useState<Options>({
    width: 300,
    height: 300,
    type: 'svg' as DrawType,
    data: 'http://qr-code-styling.com',
    image: '',
    margin: 10,
    qrOptions: {
      typeNumber: 0 as TypeNumber,
      mode: 'Byte' as Mode,
      errorCorrectionLevel: 'Q' as ErrorCorrectionLevel
    },
    imageOptions: {
      hideBackgroundDots: true,
      imageSize: 0.4,
      margin: 10,
      crossOrigin: 'anonymous',
    },
    dotsOptions: {
      color: '#222222',
      type: 'rounded' as DotType
    },
    backgroundOptions: {
      color: 'none',
    },
    cornersSquareOptions: {
      color: '#222222',
      type: 'extra-rounded' as CornerSquareType,
    },
    cornersDotOptions: {
      color: '#222222',
      type: 'dot' as CornerDotType,
    }
  });

  const [fileExt, setFileExt] = useState<Extension>("svg");

  const [qrCode] = useState<QRCodeStyling>(new QRCodeStyling(options));

  const ref = useRef<HTMLDivElement>(null);

  console.log(options)

  useEffect(() => {
    if (ref.current) {
      qrCode.append(ref.current);
    }
  }, [qrCode, ref]);

  useEffect(() => {
    if (!qrCode) return;
    qrCode.update(options);
  }, [qrCode, options]);





  const onImageSelect = (event:any) => {
    const selectedImage = event.currentTarget.files
    if (selectedImage) {
      const imageRef = selectedImage[0] || ''
      const fileType: string= imageRef.type || ""
      const reader = new FileReader()
      reader.readAsBinaryString(imageRef)
      reader.onload = (event: any) => {
        const imageData = `data:${fileType};base64,${btoa(event.target.result)}`
        setOptions(options => ({
          ...options,
          image: imageData
        }))
      }
    }

  }

  const onColorSelect = (event:any) => {
    const selectedColor = event.target.value
    
    setOptions(options => ({
      ...options,
      dotsOptions: {
          color: selectedColor
      }
    }))
  }
  const onColorSquareBorderSelect = (event:any) => {
    const selectedColor = event.target.value
    
    setOptions(options => ({
      ...options,
      cornersSquareOptions: {
          color: selectedColor
      }
    }))
  }
  const onDotsColorSelect = (event:any) => {
    const selectedColor = event.target.value
    
    setOptions(options => ({
      ...options,
      cornersDotOptions: {
          color: selectedColor
      }
    }))
  }

  useEffect(() => {
    console.log('hi')
  }, [onColorSelect])
  
  

  const onDataChange = (event: ChangeEvent<HTMLInputElement>) => {
    setOptions(options => ({
      ...options,
      data: event.target.value
    }));
  };

  const onExtensionChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setFileExt(event.target.value as Extension);
  };

  const onDownloadClick = () => {
    if (!qrCode) return;
    qrCode.download({
      extension: fileExt
    });
  };

  return (
    <div className="App">
      <div className="navBar">
        <h2>QR Code Genrator</h2>
      </div>
      <div className="bodyWrapper">
        <div className="qrBorder">
          <div className="qr" ref={ref} />
        </div>
        <div className="colors">
          <h1>Options:</h1>
            <label className="labels">
              Choose Qr Color:
              <input type="color" className="colorsOptions" onChange={onColorSelect}></input>
            </label>
            <label className="labels">
              Choose Innder Dots Color:
              <input type="color" className="colorsOptions" onChange={onDotsColorSelect}></input>
            </label>
            <label className="labels">
              Choose Squares Border  Color:
              <input type="color" className="colorsOptions" onChange={onColorSquareBorderSelect}></input>
            </label>
            <label className="labels">
              Add Your Logo:
              <br />
              <input className="logoFile" type="file" name="image" onChange={onImageSelect} accept='image/png, image/jpeg, image/webp'/>
            </label>
            <div className="inputWrapper">
              <h1 className="inputsText">Add your URL:</h1>
              <input value={options.data} onChange={onDataChange} className='inputBox' />
              <h1 className="inputsText">Choose File Type:</h1>
              <select className="fileSlector" onChange={onExtensionChange} value={fileExt}>
                <option value="svg">SVG</option>
                <option value="png">PNG</option>
                <option value="jpeg">JPEG</option>
                <option value="webp">WEBP</option>
              </select>
              <button className='downloadBtn' onClick={onDownloadClick}>Download File</button>
            </div>
          </div>
        
      </div>
    </div>
  );
}

