/**
 * Registry Layer Module
 * Manages storage, versioning, and access control of mapped data
 */

class RegistryLayer {
  constructor() {
    this.masterRegistry = new Map();
    this.versionHistory = new Map();
    this.accessControl = new Map();
    this.syncQueue = [];
  }

  /**
   * Master Registry - Store and retrieve mapped data
   * @param {string} id - Unique identifier
   * @param {Object} data - Data to store
   * @returns {boolean} Success status
   */
  register(id, data) {
    if (!id || !data) {
      throw new Error('ID and data are required for registration');
    }

    this.masterRegistry.set(id, {
      data: data,
      registeredAt: new Date().toISOString(),
      lastModified: new Date().toISOString()
    });

    // Initialize version history
    if (!this.versionHistory.has(id)) {
      this.versionHistory.set(id, []);
    }

    return true;
  }

  /**
   * Retrieve data from registry
   * @param {string} id - Unique identifier
   * @returns {Object|null} Retrieved data
   */
  retrieve(id) {
    const entry = this.masterRegistry.get(id);
    return entry ? entry.data : null;
  }

  /**
   * Version Control - Manage versions of data
   * @param {string} id - Unique identifier
   * @param {Object} data - New version data
   * @param {string} comment - Version comment
   * @returns {Object} Version info
   */
  createVersion(id, data, comment = '') {
    if (!this.masterRegistry.has(id)) {
      throw new Error(`Cannot create version: ID ${id} not found in registry`);
    }

    const versions = this.versionHistory.get(id);
    const versionNumber = versions.length + 1;
    
    const version = {
      version: versionNumber,
      data: data,
      comment: comment,
      timestamp: new Date().toISOString()
    };

    versions.push(version);
    
    // Update master registry with new version
    const entry = this.masterRegistry.get(id);
    entry.data = data;
    entry.lastModified = version.timestamp;

    return version;
  }

  /**
   * Get version history for an ID
   * @param {string} id - Unique identifier
   * @returns {Array} Version history
   */
  getVersionHistory(id) {
    return this.versionHistory.get(id) || [];
  }

  /**
   * Access Control - Manage permissions
   * @param {string} id - Unique identifier
   * @param {string} userId - User identifier
   * @param {Array} permissions - Permission list
   * @returns {boolean} Success status
   */
  setAccessControl(id, userId, permissions = ['read']) {
    if (!this.accessControl.has(id)) {
      this.accessControl.set(id, new Map());
    }

    const idPermissions = this.accessControl.get(id);
    idPermissions.set(userId, {
      permissions: permissions,
      grantedAt: new Date().toISOString()
    });

    return true;
  }

  /**
   * Check if user has permission
   * @param {string} id - Unique identifier
   * @param {string} userId - User identifier
   * @param {string} permission - Permission to check
   * @returns {boolean} Has permission
   */
  hasPermission(id, userId, permission) {
    if (!this.accessControl.has(id)) {
      return false;
    }

    const idPermissions = this.accessControl.get(id);
    const userPerms = idPermissions.get(userId);
    
    return userPerms && userPerms.permissions.includes(permission);
  }

  /**
   * Sync Engine - Queue items for synchronization
   * @param {Object} item - Item to sync
   * @returns {number} Queue position
   */
  queueSync(item) {
    const syncItem = {
      ...item,
      queuedAt: new Date().toISOString(),
      status: 'queued'
    };

    this.syncQueue.push(syncItem);
    return this.syncQueue.length;
  }

  /**
   * Process sync queue
   * @returns {Array} Processed items
   */
  processSyncQueue() {
    const processed = [];
    
    while (this.syncQueue.length > 0) {
      const item = this.syncQueue.shift();
      item.status = 'synced';
      item.syncedAt = new Date().toISOString();
      processed.push(item);
    }

    return processed;
  }

  /**
   * Get registry statistics
   * @returns {Object} Registry stats
   */
  getStats() {
    return {
      totalEntries: this.masterRegistry.size,
      totalVersions: Array.from(this.versionHistory.values())
        .reduce((sum, versions) => sum + versions.length, 0),
      queuedItems: this.syncQueue.length,
      accessControlEntries: this.accessControl.size
    };
  }

  /**
   * Export registry data
   * @returns {Object} Exported data
   */
  export() {
    return {
      registry: Array.from(this.masterRegistry.entries()),
      versionHistory: Array.from(this.versionHistory.entries()),
      accessControl: Array.from(this.accessControl.entries()).map(([id, perms]) => [
        id,
        Array.from(perms.entries())
      ]),
      syncQueue: this.syncQueue
    };
  }
}

module.exports = RegistryLayer;
