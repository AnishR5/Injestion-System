import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'];

    if (!apiKey) {
      throw new UnauthorizedException('API key missing');
    }

    // TEMP: hardcoded check (DB later)
    if (apiKey !== 'test-api-key') {
      throw new UnauthorizedException('Invalid API key');
    }

    // Attach source info (later fetched from DB)
    request.source = {
      id: 'source-123',
      name: 'test-source',
    };

    return true;
  }
}
