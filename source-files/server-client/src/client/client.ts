import { ALL_ANIMATIONS } from "./anim_list";

new class AnimViewer
{
    public opened: boolean = false;
    public render: number = null;
    public currentAnimationInfo: { dict: string, name: string } = null;
    public interestCameraDisabler: NodeJS.Timer = null;
    public movementEnabled: boolean = false;

    public AnimationList = ALL_ANIMATIONS;
    public searchedStrings: string[] = [];

    private _animFlag: number = 38;

    private KEYS = {
        ARROW_UP: 172,
        ARROW_DOWN: 173,
        ARROW_LEFT: 174,
        ARROW_RIGHT: 175,
        F: 23,
        S: 33,
        ESCAPE: 200,
        SHIFT: 21,
        E: 38,
        R: 45,
        CTRL: 36,
        C: 26
    }

    private _animIndex: number = 0;

    constructor()
    {
        onNet('open_animviewer', () => {
            this.open();
        });
    }
    open()
    {
        if (this.currentAnimationInfo === null)
        {
            this.animIndex = 0;
        }

        this.playSelectedAnim();

        if (this.interestCameraDisabler === null)
        {
            this.interestCameraDisabler = setInterval(() =>
            {
                N_0xf4f2c0d4ee209e20();
            }, 2000);
        }

        if (this.render === null)
        {
            this.render = setTick(() =>
            {
                DisableAllControlActions(0);
                EnableControlAction(0, 1, true);
                EnableControlAction(0, 2, true);

                if (this.movementEnabled)
                {
                    EnableControlAction(0, 30, true);
                    EnableControlAction(0, 31, true);
                    EnableControlAction(0, 32, true);
                    EnableControlAction(0, 33, true);
                    EnableControlAction(0, 34, true);
                    EnableControlAction(0, 35, true);
                }

                if (IsDisabledControlJustPressed(0, this.KEYS.ARROW_LEFT)) this.animIndex--;
                if (IsDisabledControlJustPressed(0, this.KEYS.ARROW_RIGHT)) this.animIndex++;
                if (IsDisabledControlJustPressed(0, this.KEYS.ARROW_UP)) this.animFlag++;
                if (IsDisabledControlJustPressed(0, this.KEYS.ARROW_DOWN)) this.animFlag--;

                /** Ctrl controls */
                if (IsDisabledControlPressed(0, this.KEYS.CTRL))
                {
                    if (IsDisabledControlJustPressed(0, this.KEYS.F)) this.openSearch();
                    if (IsDisabledControlJustPressed(0, this.KEYS.C)) ClearPedTasksImmediately(PlayerPedId());
                    if (IsDisabledControlJustPressed(0, this.KEYS.E)) this.movementEnabled = !this.movementEnabled;
                    if (IsDisabledControlJustPressed(0, this.KEYS.R))
                    {
                        this.searchedStrings = [];
                        this.AnimationList = ALL_ANIMATIONS;
                    }
                    if (IsDisabledControlJustPressed(0, this.KEYS.S)) this.openSave();
                }

                if (IsDisabledControlPressed(0, this.KEYS.SHIFT))
                {
                    if (IsDisabledControlJustReleased(0, this.KEYS.ESCAPE)) this.close();
                }

                if (this.currentAnimationInfo !== null)
                {
                    let text = `${this.animIndex} / ${this.AnimationList.length - 1}\n`;
                    text += `Dict: ${this.currentAnimationInfo.name}\n`;
                    text += `Anim: ${this.currentAnimationInfo.dict}\n`;
                    text += `Flag: ${this.animFlag}`;

                    this.DrawText2D(0.5, 0.75, text, 0.35, 0);
                }

                if (this.searchedStrings.length > 0)
                {
                    this.DrawText2D(0.5, 0.92, `Search for: ~o~${this.searchedStrings.join(', ')}`, 0.3);
                }
                this.DrawText2D(0.5, 0.95, `Close: Shift+Escape | Enable/Disable movement: CTRL+E ${this.movementEnabled ? '~g~[X]' : '~r~[ ]'}~s~ | Save: CTRL+S`);
                this.DrawText2D(0.5, 0.97, `Search: CTRL+F | Reset search: CTRL+R | Next: Arrow Right | Previous: Arrow Left | Stop: CTRL+C`);
            });
        }
    }
    close()
    {
        /** Do not close if keyboard is on the screen. */
        if (this.render !== null)
        {
            clearTick(this.render);
            this.render = null; // Important to reset to null.
        }

        if (this.interestCameraDisabler !== null)
        {
            clearInterval(this.interestCameraDisabler);
            this.interestCameraDisabler = null;
        }

        /** Just to clear the freeze on the player. */
        ClearPedTasksImmediately(PlayerPedId());
    }
    DrawText2D(x: number, y: number, text: string, size: number = 0.25, font: number = 0)
    {
        SetTextFont(font);
        SetTextProportional(false);
        SetTextScale(size, size);
        SetTextColour(255, 255, 255, 255);
        SetTextDropshadow(0, 0, 0, 0, 100);
        SetTextDropShadow();
        SetTextOutline();
        SetTextCentre(true);
        SetTextEntry('STRING');
        AddTextComponentString(text);
        DrawText(x, y);
    }
    Notification(msg: string)
    {
        SetNotificationTextEntry('STRING');
        AddTextComponentString(msg);
        DrawNotification(false, false);
    }
    get animIndex()
    {
        return this._animIndex;
    }
    set animIndex(index: number)
    {
        if (this.AnimationList[index])
        {
            this._animIndex = index;

            const [dict, name] = this.AnimationList[this.animIndex].split(' ');
            this.currentAnimationInfo = {
                name,
                dict
            }
        }

        this.playSelectedAnim();
    }
    get animFlag()
    {
        return this._animFlag;
    }
    set animFlag(a: number)
    {
        if (a < 1) return;
        this._animFlag = a;

        this.playSelectedAnim();
    }
    async playSelectedAnim()
    {
        if (this.currentAnimationInfo === null) return;

        const { dict, name } = this.currentAnimationInfo;

        RequestAnimDict(dict);
        await new Promise(resolve =>
        {
            let tries = 0;
            let c = setInterval(() =>
            {
                if (HasAnimDictLoaded(dict) || tries > 70)
                {
                    resolve(true);
                    if (c)
                    {
                        clearInterval(c);
                    }
                }
            }, 30);
        });

        TaskPlayAnim(PlayerPedId(), dict, name, 8.0, 8.0, -1, this.animFlag, 1, false, false, false);
    }
    async openSave()
    {
        if (this.currentAnimationInfo === null)
            return this.Notification(`Animation is not selected?`);

        AddTextEntry('FMMC_MPM_NA', 'Search animation by name.');
        DisplayOnscreenKeyboard(1, 'FMMC_MPM_NA', 'Search animation by name.', '', '', '', '', 60);

        while (UpdateOnscreenKeyboard() == 0)
        {
            DisableAllControlActions(0);
            await new Promise(resolve =>
            {
                setTimeout(() =>
                {
                    resolve(true);
                }, 1);
            });
        }
        if (UpdateOnscreenKeyboard() !== 1) return; // If it was cancelled do not give stupid messages.

        const result = GetOnscreenKeyboardResult();
        if (typeof result !== 'string') return this.Notification('Save input field is invalid!');

        if (this.currentAnimationInfo)
        {
            const { dict, name } = this.currentAnimationInfo;
            console.info(`[AnimViewer]: Dictory: ${dict} | Name: ${name}`);
            this.Notification(`Animation saved! You can copy and paste by opening the client console txt.`);
        }
    }
    async openSearch()
    {
        AddTextEntry('FMMC_MPM_NA', 'Search animation by name.');
        DisplayOnscreenKeyboard(1, 'FMMC_MPM_NA', 'Search animation by name.', '', '', '', '', 60);

        while (UpdateOnscreenKeyboard() == 0)
        {
            DisableAllControlActions(0);
            await new Promise(resolve =>
            {
                setTimeout(() =>
                {
                    resolve(true);
                }, 1);
            });
        }
        if (UpdateOnscreenKeyboard() !== 1) return; // If it was cancelled do not give stupid messages.

        const result = GetOnscreenKeyboardResult();
        if (typeof result !== 'string') return this.Notification('Search input is invalid!');

        const found = this.AnimationList.filter(a => a.includes(result));
        if (!found || found.length < 1) return this.Notification(`There are no animations found with: '${result}'.`);

        this.searchedStrings.push(result);

        this.AnimationList = found;
        this.Notification(`Found ${this.AnimationList.length - 1} animations with search: '${result}'.`);
        /** Reset the anim index to zero. (start) */
        this.animIndex = 0;
    }
}