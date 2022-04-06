version '1.0.0'
author 'freamee'
description 'Anim Viewer'

lua54 'yes'

escrow_ignore {
    '**'
}

server_scripts {
    'files/server.js'
}

client_scripts {
    'files/client.js'
}

dependencies {
    'yarn'
}

ui_page 'files/nui/index.html'

files {
    'files/nui/**',
}

game 'gta5'
fx_version 'adamant'
