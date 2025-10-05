export function debounce<T extends (...args: never[]) => unknown>(func: T, timeout = 300) {
  let timer: number | undefined;
  return (...args: Parameters<T>): Promise<ReturnType<T>> => {
    return new Promise((resolve) => {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        resolve(func(...args) as ReturnType<T>);
      }, timeout);
    });
  };
}
