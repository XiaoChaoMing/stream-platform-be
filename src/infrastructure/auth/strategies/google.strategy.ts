import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-google-oauth20';
import { PrismaService } from '../../prisma/prisma.service';

// Define our own type without extending Profile to avoid type conflicts
interface GoogleProfileData {
  name: {
    givenName?: string;
    familyName?: string;
  };
  emails?: Array<{ value: string; verified?: boolean }>;
  photos?: Array<{ value: string }>;
}

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  private readonly logger = new Logger(GoogleStrategy.name);

  constructor(private prisma: PrismaService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:
        process.env.GOOGLE_CALLBACK_URL ||
        'http://localhost:3000/auth/google/callback',
      scope: ['email', 'profile'],
    });
    this.logger.log(
      `Google OAuth initialized with callback URL: ${process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/auth/google/callback'}`,
    );
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    this.logger.log(
      `Google OAuth validate method called, profile ID: ${profile.id}`,
    );

    // Cast profile to our custom type
    const { name, emails, photos } = profile as unknown as GoogleProfileData;

    if (!emails || emails.length === 0) {
      this.logger.error('No email found in Google profile');
      throw new Error('No email found from Google profile');
    }

    this.logger.log(
      `Attempting to find or create user with email: ${emails[0].value}`,
    );

    // Find or create user in your database
    let user = await this.prisma.user.findUnique({
      where: { email: emails[0].value },
      include: { role: true },
    });

    if (!user) {
      this.logger.log('User not found, creating new user');

      user = await this.prisma.user.create({
        data: {
          email: emails[0].value,
          username: emails[0].value.split('@')[0],
          password: '',
          avatar: photos?.[0]?.value || null,
          role_id: 1,
        },
        include: { role: true },
      });

      this.logger.log(`New user created with ID: ${user.user_id}`);

      // Create profile for the user
      await this.prisma.profile.create({
        data: {
          user_id: user.user_id,
          name:
            `${name.givenName || ''} ${name.familyName || ''}`.trim() ||
            user.username,
          description: `Profile created via Google OAuth`,
        },
      });

      this.logger.log('Profile created for new user');
    } else {
      this.logger.log(`Existing user found with ID: ${user.user_id}`);
    }

    // Return user object that will be stored in req.user
    return {
      id: user.user_id,
      email: user.email,
      username: user.username,
      avatar: user.avatar,
      role: user.role.role_name,
      accessToken,
    };
  }
}
