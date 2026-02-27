import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { AccessTokenGuard } from './guards/access-token.guard';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { Throttle, SkipThrottle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @Post('signin')
  signin(@Body() dto: AuthDto) {
    return this.authService.signIn(dto);
  }

  @SkipThrottle()
  @UseGuards(AccessTokenGuard)
  @Get('profile')
  getProfile(@Req() req: any) {
    const id = req.user.userId || req.user.sub || req.user.id;
    return this.authService.getProfileData(id);
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  refresh(@Req() req: any) {
    const { sub: userId, email, role, refreshToken } = req.user;
    return this.authService.refreshTokens(userId, email, role, refreshToken);
  }

  @UseGuards(AccessTokenGuard)
  @Post('logout')
  logout(@Req() req: any) {
    const id = req.user.userId || req.user.sub || req.user.id;
    return this.authService.logout(id);
  }
}
