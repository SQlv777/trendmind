import { NextRequest, NextResponse } from 'next/server';
import { AggregatorService } from '@/lib/services/aggregator';
import { ApiResponse, ContentData } from '@/lib/types';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 60; // 设置最大执行时间为60秒

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const searchParams = request.nextUrl.searchParams;
    const forceRefresh = searchParams.get('refresh') === 'true';
    
    console.log(`API request received, forceRefresh: ${forceRefresh}`);
    
    // 设置API级别的超时
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('API timeout')), 55000); // 55秒API超时
    });
    
    const dataPromise = AggregatorService.getLatestContent(forceRefresh);
    
    const data = await Promise.race([dataPromise, timeoutPromise]);
    
    const duration = Date.now() - startTime;
    console.log(`API request completed in ${duration}ms`);
    
    return NextResponse.json({
      success: true,
      data,
      meta: {
        requestTime: new Date().toISOString(),
        duration: `${duration}ms`,
        cached: !forceRefresh && duration < 5000 // 如果响应很快，可能是缓存的
      }
    });
  } catch (error: any) {
    const duration = Date.now() - startTime;
    console.error(`API error after ${duration}ms:`, error);
    
    // 尝试返回缓存数据（如果有的话）
    try {
      const cachedData = await AggregatorService.getLatestContent(false);
      return NextResponse.json({
        success: false,
        error: 'Primary fetch failed, returning cached data',
        data: cachedData,
        meta: {
          requestTime: new Date().toISOString(),
          duration: `${duration}ms`,
          cached: true,
          errorMessage: error.message
        }
      }, { status: 206 }); // 206 Partial Content
    } catch (cacheError) {
      console.error('Failed to get cached data:', cacheError);
    }
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch content',
      message: error.message,
      data: {
        trending: [],
        news: [],
        lastUpdated: new Date().toISOString()
      },
      meta: {
        requestTime: new Date().toISOString(),
        duration: `${duration}ms`
      }
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'clear-cache') {
      AggregatorService.clearCache();
      return NextResponse.json({ success: true, message: 'Cache cleared' });
    }

    if (action === 'cache-status') {
      const status = AggregatorService.getCacheStatus();
      return NextResponse.json({ success: true, data: status });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
} 