import {ImageFileProcessor, createImageFromDataUrl, getImageTypeFromDataUrl} from 'ngx-image2dataurl';
import {Exif} from './exif';

export class RotateImageFileProcessor implements ImageFileProcessor {
  async process(dataURL: string): Promise<string> {
    const canvas = document.createElement('canvas');
    const image = await createImageFromDataUrl(await this.resetOrientation(dataURL));

    canvas.width = image.width;
    canvas.height = image.height;
    const ctx = canvas.getContext('2d');
    ctx.save();
    ctx.drawImage(image, 0, 0);
    ctx.restore();

    return canvas.toDataURL(getImageTypeFromDataUrl(dataURL));
  }

  /**
   * adapted from http://stackoverflow.com/questions/20600800/#40867559
   */
  private resetOrientation(srcBase64): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      let img = new Image();
      img.onload = () => {
        let exif = Exif.readFromBinaryFile(Exif.base64ToArrayBuffer(srcBase64));
        let orientation = exif.Orientation;
        if (orientation === 1 || orientation === undefined) {
          resolve(srcBase64);
        }
        let width = img.width;
        let height = img.height;
        let canvas = document.createElement('canvas');
        let ctx = canvas.getContext('2d');
        // set proper canvas dimensions before transform & export
        if ([5, 6, 7, 8].indexOf(orientation) > -1) {
          canvas.width = height;
          canvas.height = width;
        } else {
          canvas.width = width;
          canvas.height = height;
        }
        // transform context before drawing image
        switch (orientation) {
          case 2:
            ctx.transform(-1, 0, 0, 1, width, 0);
            break;
          case 3:
            ctx.transform(-1, 0, 0, -1, width, height);
            break;
          case 4:
            ctx.transform(1, 0, 0, -1, 0, height);
            break;
          case 5:
            ctx.transform(0, 1, 1, 0, 0, 0);
            break;
          case 6:
            ctx.transform(0, 1, -1, 0, height, 0);
            break;
          case 7:
            ctx.transform(0, -1, -1, 0, height, width);
            break;
          case 8:
            ctx.transform(0, -1, 1, 0, 0, width);
            break;
          default:
            ctx.transform(1, 0, 0, 1, 0, 0);
        }
        // draw image
        ctx.drawImage(img, 0, 0);
        // export base64
        resolve(canvas.toDataURL());
      };
      img.onerror = reject;
      img.src = srcBase64;
    });
  }
}

