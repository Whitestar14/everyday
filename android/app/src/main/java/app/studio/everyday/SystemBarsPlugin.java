package app.studio.everyday;

import android.graphics.Color;
import android.os.Build;
import android.view.Window;
import android.view.WindowInsetsController;
import android.view.View;

import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.PluginMethod;

@CapacitorPlugin(name = "SystemBars")
public class SystemBarsPlugin extends Plugin {

    @PluginMethod
    public void setBarsColor(PluginCall call) {
        String statusColor = call.getString("statusColor", "#000000");
        String navColor = call.getString("navColor", "#000000");
        String styles = call.getString("styles", "dark");

        Window window = getActivity().getWindow();
        window.setStatusBarColor(Color.parseColor(statusColor));
        window.setNavigationBarColor(Color.parseColor(navColor));

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            WindowInsetsController insetsController = window.getInsetsController();
            if (insetsController != null) {
                if (styles.equals("light")) {
                    insetsController.setSystemBarsAppearance(
                        WindowInsetsController.APPEARANCE_LIGHT_STATUS_BARS |
                        WindowInsetsController.APPEARANCE_LIGHT_NAVIGATION_BARS,
                        WindowInsetsController.APPEARANCE_LIGHT_STATUS_BARS |
                        WindowInsetsController.APPEARANCE_LIGHT_NAVIGATION_BARS
                    );
                } else {
                    insetsController.setSystemBarsAppearance(
                        0,
                        WindowInsetsController.APPEARANCE_LIGHT_STATUS_BARS |
                        WindowInsetsController.APPEARANCE_LIGHT_NAVIGATION_BARS
                    );
                }
            }
        } else {
            // Fallback for older Android versions
            View decorView = window.getDecorView();
            if (styles.equals("light")) {
                decorView.setSystemUiVisibility(View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR);
            } else {
                decorView.setSystemUiVisibility(0);
            }
        }

        call.resolve();
    }
}
