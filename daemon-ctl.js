#!/usr/bin/env node

const { EcommerceMonitoringDaemon } = require('./monitoring-daemon');

const args = process.argv.slice(2);
const command = args[0] || 'start';

switch (command) {
  case 'start':
    const daemon = new EcommerceMonitoringDaemon({
      checkInterval: parseInt(process.env.CHECK_INTERVAL) || 30000,
      logFile: process.env.LOG_FILE || 'monitoring.log',
      alertThreshold: parseInt(process.env.ALERT_THRESHOLD) || 3,
      baseUrl: process.env.API_BASE_URL || 'http://localhost:8080/ecommerce/api/v1',
      swaggerUrl: process.env.SWAGGER_URL || 'http://localhost:8080/swagger-ui.html'
    });

    daemon.start();

    process.on('SIGINT', () => {
      console.log('\nShutting down daemon...');
      daemon.stop();
      process.exit(0);
    });

    process.on('SIGTERM', () => {
      console.log('\nShutting down daemon...');
      daemon.stop();
      process.exit(0);
    });

    break;

  case 'stats':
    const statsDaemon = new EcommerceMonitoringDaemon();
    statsDaemon.getMonitoringStats().then(stats => {
      console.log(JSON.stringify(stats, null, 2));
      process.exit(0);
    }).catch(err => {
      console.error('Error getting stats:', err);
      process.exit(1);
    });
    break;

  case 'report':
    const reportDaemon = new EcommerceMonitoringDaemon();
    reportDaemon.generateReport().then(report => {
      console.log('Report generated:', report);
      process.exit(0);
    }).catch(err => {
      console.error('Error generating report:', err);
      process.exit(1);
    });
    break;

  default:
    console.log('Usage: node daemon-ctl.js <command>');
    console.log('Commands:');
    console.log('  start    - Start the monitoring daemon');
    console.log('  stats    - Get current monitoring stats');
    console.log('  report   - Generate a monitoring report');
    console.log('\nEnvironment variables:');
    console.log('  CHECK_INTERVAL   - Check interval in milliseconds (default: 30000)');
    console.log('  LOG_FILE         - Log file path (default: monitoring.log)');
    console.log('  ALERT_THRESHOLD  - Number of consecutive failures before alert (default: 3)');
    console.log('  API_BASE_URL     - API base URL (default: http://localhost:8080/ecommerce/api/v1)');
    console.log('  SWAGGER_URL      - Swagger UI URL (default: http://localhost:8080/swagger-ui.html)');
    process.exit(1);
}
