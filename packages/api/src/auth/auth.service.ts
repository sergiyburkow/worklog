import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    const token = this.jwtService.sign({ 
      sub: user.id,
      email: user.email,
      role: user.role
    });

    await this.prisma.userToken.create({
      data: {
        userId: user.id,
        jwtToken: token,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      },
    });

    return {
      access_token: token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
    };
  }

  async register(email: string, password: string, name: string) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        name,
        role: 'GUEST', // За замовчуванням новий користувач отримує роль GUEST
      },
    });

    return this.login(email, password);
  }

  async loginAnonymous(nickname: string) {
    // Створюємо тимчасовий email для анонімного користувача
    const tempEmail = `${nickname}_${Date.now()}@anonymous.worklog`;
    const tempPassword = Math.random().toString(36).slice(-8);
    
    // Реєструємо користувача
    const user = await this.register(tempEmail, tempPassword, nickname);
    
    return {
      accessToken: user.access_token,
      user: {
        id: user.user.id,
        email: user.user.email,
        name: user.user.name,
        role: user.user.role,
      },
    };
  }

  async changePassword(email: string, currentPassword: string, newPassword: string) {
    const user = await this.validateUser(email, currentPassword);
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    await this.prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: hashedPassword },
    });

    return { message: 'Password changed successfully' };
  }
} 