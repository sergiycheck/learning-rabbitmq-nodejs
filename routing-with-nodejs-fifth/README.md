To receive all the logs:

```bash
./receive_logs_topic.js "#"
```

To receive all logs from the facility "kern":

```bash
./receive_logs_topic.js "kern.*"
```

Or if you want to hear only about "critical" logs:

```bash
./receive_logs_topic.js "*.critical"
```

You can create multiple bindings:

```bash
./receive_logs_topic.js "kern.*" "*.critical"
```

And to emit a log with a routing key "kern.critical" type:

```bash
./emit_log_topic.js "kern.critical" "A critical kernel error"
```
