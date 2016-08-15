const player = require('play-sound')(opts = {})
const spawn = require('child_process').spawn
const clc = require('cli-color')


var setupThrobber = require('cli-color/throbber');

var throbber = setupThrobber(function (str) {
  var text = '.'
  var style = { ".": clc.xterm(13)("⚡︎") }
  process.stdout.write(clc.art(text, style))
}, 100)

throbber.start()

// at any time you can stop/start throbber
// throbber.stop()

player.play('outrun.m4a', function(err){
  console.log(err)
})

const cmd = process.argv[2]
let args = process.argv
args.splice(0, 3)

if(cmd){
  const task = spawn(cmd, args)
  task.stdout.on('data', (data) => {
    console.log(`${data}`)
  })
  task.stderr.on('data', (data) => {
    console.log(`${data}`)
  })
  task.on('close', (code) => {
    
  })
}
