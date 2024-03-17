import { toast } from 'react-toastify';

export class CommonHelper {
  static newId(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0,
        v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  static showSuccess(message: string) {
    toast(message, {type: 'success', position: 'bottom-right'});
  }
}
