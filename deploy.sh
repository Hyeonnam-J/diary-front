#!/bin/bash

REPOSITORY=/home/ec2-user/deploy
cd $REPOSITORY 

# JAR_NAME=$(ls $REPOSITORY | grep '.jar' | tail -n 1) 
# JAR_PATH=$REPOSITORY/$JAR_NAME

# APP_NAME=diary-front
# CURRENT_PID=$(pgrep -fl diary-api | grep java | awk '{print $1}')

# if [ -z "$CURRENT_PID" ]; then
#     echo "NOT RUNNING"
# else
#     echo "> kill -9 $CURRENT_PID"
#     kill -15 $CURRENT_PID
#     sleep 5
# fi

# echo "> $JAR_PATH 배포"
# nohup java -jar $JAR_PATH > /dev/null 2> /dev/null < /dev/null &