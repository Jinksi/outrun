#!/usr/bin/env node

"use strict"

const child_process = require('child_process')
const spawn = child_process.spawn
const clc = require('cli-color')
const fs = require('fs')
const path = require('path')
const findExec = require('find-exec')

let isFile

function PlaySound(){
  this.players = [
    'mplayer',
    'afplay',
    'mpg123',
    'mpg321',
    'play',
    'omxplayer'
  ]

  this.player = findExec(this.players)

  this.play = function(sound, callback){
    try {
      isFile = fs.statSync(sound).isFile()
    } catch (err){
      isFile = false
    }

    if (!sound) return callback(new Error("No audio file specified"))

    if (!isFile){
      return callback(new Error(sound + " is not a file"))
    }

    if (!this.player){
      return callback(new Error("Couldn't find a suitable audio player"))
    }

    this.child = child_process.execFile(this.player, [sound], function(err, stdout, stderr){
      callback(err)
    })
  }

  this.stop = function(){
    if(this.child) this.child.kill()
  }
}

const player = new PlaySound()

player.play(__dirname + '/outrun.m4a', function(err){
  console.log(err)
})

const setupThrobber = require('cli-color/throbber')

const throbber = setupThrobber(function (str) {
  const text = '.'
  const style = { ".": clc.xterm(13)("⚡︎") }
  process.stdout.write(clc.art(text, style))
}, 100)
throbber.start()

const cmd = process.argv[2]
let args = process.argv
args.splice(0, 3)

if(cmd){
  const task = spawn(cmd, args)
  task.stdout.on('data', (data) => {
    console.log(`\n${data}`)
  })
  task.stderr.on('data', (data) => {
    console.log(`\n${data}`)
  })
  task.on('close', (code) => {
    player.stop()
    throbber.stop()
    process.exit()
  })
}
