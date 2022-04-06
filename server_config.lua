-- Add your admin functions here, so only he can trigger the client event.
RegisterCommand('animviewer', function(source)
    TriggerClientEvent('open_animviewer', source)
end, false)