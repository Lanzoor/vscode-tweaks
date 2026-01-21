# 🎨✨ Welcome to VSCode Tweaks! ✨🎨

Hey there! 👋 Ready to supercharge your VSCode with **effects, animations, and overlays** that’ll make your editor come alive? Let’s get your VSCode looking absolutely aesthetic. Follow along! It gets a bit manual, but I promise - it will be worth it!

**Make sure to read this till the end, because there are lot's of FAQs you might need to consider!**

---

## 🧩 Step 1 - Install the Custom CSS Extension

We’ll need **be5invis.vscode-custom-css** to load our styles!

- Open the **Extensions** sidebar in VSCode
- Search for `be5invis.vscode-custom-css`
- Click **Install** ✅

Or just install it using your terminal.

```sh
code --install-extension be5invis.vscode-custom-css
```

---

## 📦 Step 2 - Download the VSCode Tweaks

### 🐧 On Linux:

```sh
cd ~/
git clone https://github.com/Lanzoor/vscode-tweaks.git
cd ~/vscode-tweaks/

npm install # Install the required packages for the server
npx tsc
npm start # Start the server!
```

### 🪟 On Windows:

Head to 👉 [https://github.com/Lanzoor/vscode-tweaks/releases/latest/](https://github.com/Lanzoor/vscode-tweaks/releases/latest/) Then click **Source Code (zip)** to download the source code. Unzip it somewhere comfy, like your Downloads folder! (`C:/Users/{YOUR USERNAME}/Downloads`)

---

## ⚙️ Step 3 - Add the Tweaks to Your `settings.json`

Add the following entries to your `settings.json` file! Make sure to tweak the locations based on where the files are actually at.

### 🐧 Linux:

```json
{
    "vscode_custom_css.imports": [
        // GLOBAL FILE: ALWAYS NEEDS TO BE FIRST
        "file:///home/{YOUR USERNAME}/vscode-tweaks/colors.js",

        "file:///home/{YOUR USERNAME}/vscode-tweaks/styles.css",

        "file:///home/{YOUR USERNAME}/vscode-tweaks/out/blur.js",
        "file:///home/{YOUR USERNAME}/vscode-tweaks/out/modals.js",
        "file:///home/{YOUR USERNAME}/vscode-tweaks/out/mouseeffects.js",
        "file:///home/{YOUR USERNAME}/vscode-tweaks/out/overlays.js"
    ]
}
```

### 🪟 Windows:

```json
{
    "vscode_custom_css.imports": [
        // GLOBAL FILE: ALWAYS NEEDS TO BE FIRST
        "file:///C:/Users/{YOUR USERNAME}/Downloads/vscode-tweaks/colors.js",

        "file:///C:/Users/{YOUR USERNAME}/Downloads/vscode-tweaks/styles.css",

        "file:///C:/Users/{YOUR USERNAME}/Downloads/vscode-tweaks/out/blur.js",
        "file:///C:/Users/{YOUR USERNAME}/Downloads/vscode-tweaks/out/modals.js",
        "file:///C:/Users/{YOUR USERNAME}/Downloads/vscode-tweaks/out/mouseeffects.js",
        "file:///C:/Users/{YOUR USERNAME}/Downloads/vscode-tweaks/out/overlays.js"
    ]
}
```

> 💡 **Tip:** If you’ve got _other themes or scripts, **especially those that inject JS and CSS**,_ messing with VSCode visuals, consider disabling them first! Mixing too many visuals may result in weird results and visuals. **This overlay was designed with dark themes in mind, so why not grab one?**

---

## 🔄 Step 4 - Restart and Activate

1. Press **Ctrl+Shift+P** to open the command panel.
2. Type **Enable Custom CSS and JS**.
3. Click it!
4. VSCode will show you a pop-up, saying you need to restart after changing, click **Restart Visual Studio Code**

And just like that, you can enjoy the new experience!

## OPTIONAL - Enable the server

There is a local server that enhances the experience even further! Go to the installed directory, and run the following command;

```sh
cd ~/vscode-tweaks/

npm install # Install the required packages, if you haven't already.
npm start # Run the server already!
```

> **Note:** Since this is a local server, you will need to manually enable it everytime you want to use it. Maintaining a global server is out of our bounds, and it is the only way to use cool useful packages.

---

## 🧠 Notes & Troubleshooting

> **Note: If VSCode crashes or/and fails to open, a fresh reinstall will fix it.** Just make sure to backup your settings and stuff.

### ⚠️ Linux Permissions

If VSCode complains about permissions, run this:

```sh
sudo chown -R $USER /usr/share/code/
```

Change `/usr/share/code/` to where VSCode was installed. You must have read/write permission on the VSCode installation for the CSS and JS tweaks to work.

### 🔁 After Updates

VSCode breaks these tweaks after updates. If that happens:

- _If you’re on Linux, run the chown command_
- Re-run the `Ctrl+Shift+P` → `Enable Custom CSS and JS` command
- Restart VSCode again

### 🚨 “VSCode installation is corrupted” warning

Don’t panic, it’s totally normal. You can **safely ignore it**. You can click the small cog icon (⚙️), and click **Don't Show Again**. Bye-bye!

### Modifying code

Feel free to tweak the CSS and TypeScript files to cherry-pick all the features you may like.

**However, always remember to run `npx tsc` in the directory after changes in the `/src/` files.** If you forget this step, you will be confused.

### How to Update vscode-tweaks

On Linux;

```sh
cd ~/vscode-tweaks/
git pull

npm install # Maybe re-install the packages again
npx tsc
npm start
```

On Windows, you might have to download the files manually on GitHub. Head to 👉 [https://github.com/Lanzoor/vscode-tweaks/releases/latest/](https://github.com/Lanzoor/vscode-tweaks/releases/latest/) Then click **Source Code (zip)** to download the source code. Unzip it, and replace the old files.

By the way, until I make an automatic update system, you still might want to check frequently for updates. Sorry!

---

🎉 **And that’s it!** You now have a supercharged, stylish, animated VSCode setup!
