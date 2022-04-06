version '1.0.0'
author 'freamee'
description 'Anim Viewer'

lua54 'yes'

escrow_ignore {
    '**'
}

server_scripts {
    'server_config.lua',
    'files/server.js'
}

client_scripts {
    'files/client.js'
}

game 'gta5'
fx_version 'adamant'
