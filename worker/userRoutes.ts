import { Hono } from "hono";
import { getAgentByName } from 'agents';
import { ChatAgent } from './agent';
import { API_RESPONSES } from './config';
import { Env, getAppController, registerSession, unregisterSession } from "./core-utils";
import JSZip from 'jszip';
/**
 * DO NOT MODIFY THIS FUNCTION. Only for your reference.
 */
export function coreRoutes(app: Hono<{ Bindings: Env }>) {
    // Use this API for conversations. **DO NOT MODIFY**
    app.all('/api/chat/:sessionId/*', async (c) => {
        try {
        const sessionId = c.req.param('sessionId');
        const agent = await getAgentByName<Env, ChatAgent>(c.env.CHAT_AGENT, sessionId); // Get existing agent or create a new one if it doesn't exist, with sessionId as the name
        const url = new URL(c.req.url);
        url.pathname = url.pathname.replace(`/api/chat/${sessionId}`, '');
        return agent.fetch(new Request(url.toString(), {
            method: c.req.method,
            headers: c.req.header(),
            body: c.req.method === 'GET' || c.req.method === 'DELETE' ? undefined : c.req.raw.body
        }));
        } catch (error) {
        console.error('Agent routing error:', error);
        return c.json({
            success: false,
            error: API_RESPONSES.AGENT_ROUTING_FAILED
        }, { status: 500 });
        }
    });
}
export function userRoutes(app: Hono<{ Bindings: Env }>) {
    // SonusPrime Routes
    app.post('/api/upload', async (c) => {
        try {
            const formData = await c.req.formData();
            const file = formData.get('file') as File;
            if (!file) {
                return c.json({ success: false, error: 'No file uploaded.' }, { status: 400 });
            }
            const zip = await JSZip.loadAsync(await file.arrayBuffer());
            const stemNames = Object.keys(zip.files).filter(name => !name.endsWith('/') && !name.startsWith('__MACOSX'));
            return c.json({ success: true, data: { stems: stemNames } });
        } catch (error) {
            console.error('Upload error:', error);
            return c.json({ success: false, error: 'Failed to process ZIP file.' }, { status: 500 });
        }
    });
    app.post('/api/analyze', async (c) => {
        try {
            const { stemsA, stemsB } = await c.req.json<{ stemsA: string[], stemsB: string[] }>();
            const cleanName = (s: string) => s.replace(/\.[^/.]+$/, "").split('/').pop() || s;
            const setA = new Set(stemsA.map(cleanName));
            const commonStems = stemsB.map(cleanName).filter(name => setA.has(name));
            const uniqueCommonStems = [...new Set(commonStems)];
            const getRandomScore = () => Math.floor(Math.random() * 21) + 80;
            // Simulate analysis delay
            await new Promise(resolve => setTimeout(resolve, 2000));
            const results = uniqueCommonStems.map(name => ({
                name,
                scores: {
                    A: getRandomScore(),
                    B: getRandomScore(),
                },
            }));
            return c.json({ success: true, data: results });
        } catch (error) {
            console.error('Analysis error:', error);
            return c.json({ success: false, error: 'Failed to analyze stems.' }, { status: 500 });
        }
    });
    app.post('/api/create-mix', async (c) => {
        try {
            const formData = await c.req.formData();
            const fileA = formData.get('fileA') as File;
            const fileB = formData.get('fileB') as File;
            const selections = JSON.parse(formData.get('selections') as string) as { name: string, selectedVersion: 'A' | 'B' }[];
            if (!fileA || !fileB || !selections) {
                return c.json({ success: false, error: 'Missing required data.' }, { status: 400 });
            }
            const zipA = await JSZip.loadAsync(await fileA.arrayBuffer());
            const zipB = await JSZip.loadAsync(await fileB.arrayBuffer());
            const finalZip = new JSZip();
            const findFileByName = (zip: JSZip, name: string) => {
                const cleanName = (s: string) => s.replace(/\.[^/.]+$/, "").split('/').pop() || s;
                const exactMatch = Object.keys(zip.files).find(fileName => !zip.files[fileName].dir && cleanName(fileName) === name);
                return exactMatch ? zip.file(exactMatch) : null;
            };
            for (const selection of selections) {
                const sourceZip = selection.selectedVersion === 'A' ? zipA : zipB;
                const file = findFileByName(sourceZip, selection.name);
                if (file) {
                    const buffer = await file.async('arraybuffer');
                    finalZip.file(file.name.split('/').pop() || file.name, buffer);
                }
            }
            const content = await finalZip.generateAsync({ type: 'blob' });
            return new Response(content, {
                headers: {
                    'Content-Type': 'application/zip',
                    'Content-Disposition': 'attachment; filename="SonusPrime_Mix.zip"',
                },
            });
        } catch (error) {
            console.error('Mix creation error:', error);
            return c.json({ success: false, error: 'Failed to create mix.' }, { status: 500 });
        }
    });
    // Add your routes here
    /**
     * List all chat sessions
     * GET /api/sessions
     */
    app.get('/api/sessions', async (c) => {
        try {
            const controller = getAppController(c.env);
            const sessions = await controller.listSessions();
            return c.json({ success: true, data: sessions });
        } catch (error) {
            console.error('Failed to list sessions:', error);
            return c.json({
                success: false,
                error: 'Failed to retrieve sessions'
            }, { status: 500 });
        }
    });
    /**
     * Create a new chat session
     * POST /api/sessions
     * Body: { title?: string, sessionId?: string }
     */
    app.post('/api/sessions', async (c) => {
        try {
            const body = await c.req.json().catch(() => ({}));
            const { title, sessionId: providedSessionId, firstMessage } = body;
            const sessionId = providedSessionId || crypto.randomUUID();
            // Generate better session titles
            let sessionTitle = title;
            if (!sessionTitle) {
                const now = new Date();
                const dateTime = now.toLocaleString([], {
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                });
                if (firstMessage && firstMessage.trim()) {
                    const cleanMessage = firstMessage.trim().replace(/\s+/g, ' ');
                    const truncated = cleanMessage.length > 40
                        ? cleanMessage.slice(0, 37) + '...'
                        : cleanMessage;
                    sessionTitle = `${truncated} • ${dateTime}`;
                } else {
                    sessionTitle = `Chat ${dateTime}`;
                }
            }
            await registerSession(c.env, sessionId, sessionTitle);
            return c.json({
                success: true,
                data: { sessionId, title: sessionTitle }
            });
        } catch (error) {
            console.error('Failed to create session:', error);
            return c.json({
                success: false,
                error: 'Failed to create session'
            }, { status: 500 });
        }
    });
    /**
     * Delete a chat session
     * DELETE /api/sessions/:sessionId
     */
    app.delete('/api/sessions/:sessionId', async (c) => {
        try {
            const sessionId = c.req.param('sessionId');
            const deleted = await unregisterSession(c.env, sessionId);
            if (!deleted) {
                return c.json({
                    success: false,
                    error: 'Session not found'
                }, { status: 404 });
            }
            return c.json({ success: true, data: { deleted: true } });
        } catch (error) {
            console.error('Failed to delete session:', error);
            return c.json({
                success: false,
                error: 'Failed to delete session'
            }, { status: 500 });
        }
    });
    /**
     * Update session title
     * PUT /api/sessions/:sessionId/title
     * Body: { title: string }
     */
    app.put('/api/sessions/:sessionId/title', async (c) => {
        try {
            const sessionId = c.req.param('sessionId');
            const { title } = await c.req.json();
            if (!title || typeof title !== 'string') {
                return c.json({
                    success: false,
                    error: 'Title is required'
                }, { status: 400 });
            }
            const controller = getAppController(c.env);
            const updated = await controller.updateSessionTitle(sessionId, title);
            if (!updated) {
                return c.json({
                    success: false,
                    error: 'Session not found'
                }, { status: 404 });
            }
            return c.json({ success: true, data: { title } });
        } catch (error) {
            console.error('Failed to update session title:', error);
            return c.json({
                success: false,
                error: 'Failed to update session title'
            }, { status: 500 });
        }
    });
    /**
     * Get session count and stats
     * GET /api/sessions/stats
     */
    app.get('/api/sessions/stats', async (c) => {
        try {
            const controller = getAppController(c.env);
            const count = await controller.getSessionCount();
            return c.json({
                success: true,
                data: { totalSessions: count }
            });
        } catch (error) {
            console.error('Failed to get session stats:', error);
            return c.json({
                success: false,
                error: 'Failed to retrieve session stats'
            }, { status: 500 });
        }
    });
    /**
     * Clear all chat sessions
     * DELETE /api/sessions
     */
    app.delete('/api/sessions', async (c) => {
        try {
            const controller = getAppController(c.env);
            const deletedCount = await controller.clearAllSessions();
            return c.json({
                success: true,
                data: { deletedCount }
            });
        } catch (error) {
            console.error('Failed to clear all sessions:', error);
            return c.json({
                success: false,
                error: 'Failed to clear all sessions'
            }, { status: 500 });
        }
    });
    // Example route - you can remove this
    app.get('/api/test', (c) => c.json({ success: true, data: { name: 'this works' }}));
    // 🤖 AI Extension Point: Add more custom routes here
}