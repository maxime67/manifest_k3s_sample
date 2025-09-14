# Script pour nettoyer les fichiers markdown des shortcodes Docsy
cd ~/manifest_k3s_sample/docs/content

# Nettoyer tous les fichiers .md des shortcodes incompatibles
find . -name "*.md" -type f -exec sed -i 's/{{< alert.*>}}/> **💡 Info**/g' {} \;
find . -name "*.md" -type f -exec sed -i 's/{{< \/alert >}}//g' {} \;
find . -name "*.md" -type f -exec sed -i 's/{{< cardpane >}}/<!-- cardpane -->/g' {} \;
find . -name "*.md" -type f -exec sed -i 's/{{< \/cardpane >}}/<!-- \/cardpane -->/g' {} \;
find . -name "*.md" -type f -exec sed -i 's/{{< card.*>}}/### /g' {} \;
find . -name "*.md" -type f -exec sed -i 's/{{< \/card >}}//g' {} \;
find . -name "*.md" -type f -exec sed -i 's/{{< columns >}}/<!-- colonnes -->/g' {} \;
find . -name "*.md" -type f -exec sed -i 's/{{< \/columns >}}/<!-- \/colonnes -->/g' {} \;
find . -name "*.md" -type f -exec sed -i 's/<--->/---/g' {} \;
find . -name "*.md" -type f -exec sed -i 's/{{< hint.*>}}/> **📝 Note**/g' {} \;
find . -name "*.md" -type f -exec sed -i 's/{{< \/hint >}}//g' {} \;
