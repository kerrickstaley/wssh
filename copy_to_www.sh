#!/bin/bash
files=(
ShellInABox/*
)
if [ "$HOSTNAME" = "webdev.dwtj.me" ]; then
    cp "${files[@]}" /home/www/data/
else
    scp "${files[@]}" dwtj.me:/
fi
