#!/bin/bash
set -e

while read line; do
	line=`echo $line | cut -d ' ' -f2`
	if [ ! "$line" = "" ]; then

	  echo "
  $line: createPermission(data: {
    display: \"\"
    value: $line
    createdBy: {
      connect: {
        display: \"Placeholder User\"
      }
    }
    updatedBy: {
      connect: {
        display: \"Placeholder User\"
      }
    }
  }) {
    id
  }"

	fi
done < $1
