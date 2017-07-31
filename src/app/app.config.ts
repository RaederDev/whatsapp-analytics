export const CONFIG = {
  whatsAppDatabaseFolder: '/data/data/com.whatsapp/databases/',
  whatsAppMessageStoreDatabase: 'msgstore.db',
  whatsAppUserDatabase: 'wa.db',
  whatsAppDatabases: [
    'msgstore.db',
    'wa.db'
  ],

  //change this flag to stop the app from copying the database around all the time
  //during development
  copyDatabase: false
};
