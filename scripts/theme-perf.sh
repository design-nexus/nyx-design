#!/bin/bash
# Theme Engine performance, on a private session bus (run under dbus-run-session)
# with scratch XDG folders and the desktop outputs off.
set -u
T=${NYX_THEME:-$(dirname "$0")/../target/release/nyx-theme}
D=${NYX_THEMED:-$(dirname "$0")/../../nyx-system/target/release/nyx-themed}
S=$(mktemp -d /tmp/nyx-theme-perf.XXXX)
mkdir -p $S/{config,data,state,cache,rt}; chmod 700 $S/rt
export XDG_CONFIG_HOME=$S/config XDG_DATA_HOME=$S/data XDG_STATE_HOME=$S/state XDG_CACHE_HOME=$S/cache XDG_RUNTIME_DIR=$S/rt XDG_DATA_DIRS=$S/none
export NYX_THEMED_OUTPUTS=0 NYX_REDUCE_MOTION=0 NYX_HIGH_CONTRAST=0
echo "## resolution (release)"; $T bench
$D > $S/themed.log 2>&1 & pid=$!
sleep 1
echo "## idle service"
rss() { awk '/VmRSS/{print $2" kB"}' /proc/$pid/status; }
cpu() { awk '{print $14+$15}' /proc/$pid/stat; }
echo "RSS after start: $(rss)"; c0=$(cpu); sleep 10; c1=$(cpu)
echo "CPU over 10 s idle: $((c1 - c0)) ticks ($(getconf CLK_TCK)/s)"
echo "## switch latency (set → ThemeChanged received)"
$T watch > $S/watch.log 2>&1 & w=$!
sleep 0.5
for t in nord dracula gruvbox-dark rose-pine catppuccin-mocha nyx-light kanagawa tokyo-night nyx-dark catppuccin-mocha; do
  n0=$(wc -l < $S/watch.log); s=$(date +%s%N)
  $T set $t > /dev/null
  while [ "$(wc -l < $S/watch.log)" -le "$n0" ]; do sleep 0.002; done
  e=$(date +%s%N); echo "$t: $(( (e - s) / 1000000 )) ms"
done
echo "## rapid changes (10 in a row, no waiting)"
n0=$(wc -l < $S/watch.log)
for t in nord dracula gruvbox-dark rose-pine kanagawa nord dracula gruvbox-dark rose-pine everforest; do $T set $t > /dev/null; done
sleep 1.5
echo "announcements: $(( $(wc -l < $S/watch.log) - n0 )), snapshot shows: $(python3 -c "import json; print(json.load(open('$S/rt/nyx/theme/system.json'))['theme']['id'])")"
echo "RSS after switching: $(rss)"
kill $w $pid 2>/dev/null; wait 2>/dev/null
rm -rf $S
