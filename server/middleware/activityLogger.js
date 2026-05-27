import { getDb } from '../db/pg.js';

/**
 * Middleware: logs all admin actions to activity_logs table
 * Captures: user_id, action, entity_type, entity_id, old/new values, IP
 */
export async function logActivity(req, res, next) {
  const originalJson = res.json.bind(res);

  res.json = async function(body) {
    // Only log successful mutations
    if (res.statusCode >= 200 && res.statusCode < 300 && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
      try {
        const db = getDb();
        const userId = req.user?.id || null;
        const entityType = req.baseUrl.split('/').pop() || 'unknown';
        const entityId = req.params.id || body?.id || null;

        // Determine action
        const actionMap = { POST: 'create', PUT: 'update', PATCH: 'update', DELETE: 'delete' };
        const action = actionMap[req.method] || req.method.toLowerCase();

        // Try to capture old value for updates
        let oldValue = null;
        let newValue = null;

        if (req.method === 'PUT' || req.method === 'PATCH') {
          oldValue = req.body._oldValue ? JSON.stringify(req.body._oldValue) : null;
          newValue = JSON.stringify(body);
        } else if (req.method === 'POST') {
          newValue = JSON.stringify(body);
        } else if (req.method === 'DELETE') {
          oldValue = JSON.stringify({ id: req.params.id });
        }

        // Truncate large values
        if (newValue && newValue.length > 2000) newValue = newValue.substring(0, 2000) + '...';
        if (oldValue && oldValue.length > 2000) oldValue = oldValue.substring(0, 2000) + '...';

        await db.prepare(`
          INSERT INTO activity_logs (user_id, action, entity_type, entity_id, old_value, new_value, ip_address, user_agent)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          userId,
          action,
          entityType,
          entityId,
          oldValue,
          newValue,
          req.ip || req.connection.remoteAddress,
          req.headers['user-agent'] || '',
        );
      } catch (err) {
        // Don't let logging errors break the response
        console.error('Activity log error:', err.message);
      }
    }

    return originalJson(body);
  };

  next();
}
