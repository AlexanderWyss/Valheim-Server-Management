import { environment } from '../environments/environment';

export function getUrl(): string {
  if (environment.production) {
    return window.location.hostname + ':' + window.location.port;
  } else {
    return 'localhost:3000';
  }
}

export function getProtocol(): string {
  return window.location.protocol + '//';
}
