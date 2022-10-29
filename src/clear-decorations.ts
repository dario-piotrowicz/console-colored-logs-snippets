import * as vscode from 'vscode';
import { decorationTypesMap } from "./decoration-types-map";

export function clearDecorations() {
  for (const decorationType of decorationTypesMap.values() ) {
    vscode.window.activeTextEditor?.setDecorations(decorationType, []);
  }
}
