#!/bin/bash
cd "$(dirname "$0")"
python3 -m daphne -b 0.0.0.0 -p 4000 config.asgi:application
