import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_SUPABASE_SERVICE_ROLE!,
    );
  }

  getClient(): SupabaseClient {
    return this.supabase;
  }

  async uploadImage(fileName: string, fileBuffer: Buffer) {
    return await this.supabase.storage
      .from(process.env.NEXT_PUBLIC_STORAGE_BUCKET!)
      .upload(fileName, fileBuffer, { upsert: true });
  }

  async deleteImage(fileName: string) {
    return await this.supabase.storage
      .from(process.env.NEXT_PUBLIC_STORAGE_BUCKET!)
      .remove([fileName]);
  }

  getPublicUrl(path: string): string {
    return this.joinUrlParts(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      'storage/v1/object/public',
      process.env.NEXT_PUBLIC_STORAGE_BUCKET!,
      path,
    );
  }

  private joinUrlParts(...parts: string[]): string {
    return parts
      .map((part) => part.replace(/^\/+|\/+$/g, '')) // 각 부분의 앞뒤 슬래시 제거
      .join('/')
      .replace(/\/{2,}/g, '/'); // 혹시 모를 중복 슬래시 제거
  }
}
