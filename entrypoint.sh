#!/bin/ash
set -eu

remote=${1:-}
ref=${2:-}

if [ -z "$remote" ] || [ -z "$ref" ]; then
	echo "Usage: $0 <<remote>> <<ref>>"
	exit 1
fi

git fetch $remote $ref --verbose
echo ""

local_ref="HEAD"
remote_ref="refs/remotes/$remote/$ref"

local_rev=$( git show-ref --hash --verify $local_ref )
remote_rev=$( git show-ref --hash --verify $remote_ref )

if [ "$local_rev" = "$remote_rev" ]; then
	echo "$local_ref == $remote_ref == $remote_rev"
	exit 0
else
	echo "$local_ref == $local_rev"
	echo "$remote_ref == $remote_rev"
	echo "$local_ref != $remote_ref"
	exit 1
fi
