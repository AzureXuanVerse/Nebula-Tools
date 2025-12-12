import type { APIRoute } from 'astro';
import { t } from '../../i18n';
import type { Language } from '../../types';

const resolveLang = (request: Request): Language => {
  const h = request.headers.get('x-lang');
  if (h === 'zh_CN' || h === 'zh_TW' || h === 'en_US' || h === 'ja_JP' || h === 'ko_KR') return h as Language;
  const al = request.headers.get('accept-language') || '';
  const lower = al.toLowerCase();
  if (lower.includes('en')) return 'en_US';
  if (lower.includes('zh')) return 'zh_CN';
  return 'zh_CN';
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    
    // 从请求体中获取目标服务器地址
    const { serverUrl, token, command } = body;
    
    if (!serverUrl || !token || !command) {
      const lang: Language = resolveLang(request);
      return new Response(JSON.stringify({
        Code: 400,
        Msg: t(lang, 'remote.missingParams')
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    // 转发请求到目标服务器 (使用正确的路径 /api/command)
    const targetUrl = serverUrl.endsWith('/api/command') ? serverUrl : `${serverUrl}/api/command`;
    
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token,
        command
      })
    });
    const raw = await response.text();

    const parseApi = (s: string): any => {
      let text = s;
      text = text.trim();
      try {
        const direct = JSON.parse(text);
        if (typeof direct === 'string') {
          return parseApi(direct);
        }
        return direct;
      } catch {}
      if (text.startsWith('"') && text.endsWith('"')) {
        try {
          const unquoted = text.slice(1, -1).replace(/\\"/g, '"');
          return JSON.parse(unquoted);
        } catch {}
      }
      const start = text.indexOf('{');
      const end = text.lastIndexOf('}');
      if (start !== -1 && end !== -1 && end > start) {
        try {
          return JSON.parse(text.slice(start, end + 1));
        } catch {}
      }
      const codeMatch = text.match(/"Code"\s*:\s*(\d+)/);
      const msgMatch = text.match(/"Msg"\s*:\s*"([\s\S]*?)"/);
      if (codeMatch || msgMatch) {
        return { Code: codeMatch ? Number(codeMatch[1]) : (response.ok ? 200 : 500), Msg: msgMatch ? msgMatch[1] : '' };
      }
      const lang: Language = resolveLang(request);
      return { Code: response.ok ? 200 : response.status || 500, Msg: t(lang, 'remote.upstreamInvalidJson') };
    };

    const data = parseApi(raw);

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Proxy error:', error);
    const lang: Language = resolveLang(request);
    const detail = (typeof error === 'string')
      ? error
      : (error instanceof Error ? error.message : String(error ?? ''));
    return new Response(JSON.stringify({
      Code: 500,
      Msg: t(lang, 'remote.proxyFailedPrefix') + (detail && detail.trim() ? detail : t(lang, 'remote.unknownError'))
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
