###
# SETUP
###

# On Master: (for debian 12.7.1 on proxmox LXC)
curl -sfL https://get.k3s.io | INSTALL_K3S_EXEC="--kubelet-arg=feature-gates=KubeletInUserNamespace=true" sh -

# get token
cat /var/lib/rancher/k3s/server/node-token

# On nodes: (for debian 12.7.1 on proxmox LXC)
curl -sfL https://get.k3s.io | K3S_URL=https://MASTER_IP:6443 K3S_TOKEN=YOUR_TOKEN INSTALL_K3S_EXEC="--kubelet-arg=feature-gates=KubeletInUserNamespace=true" sh -


###
# Debug:
###

# Access the service journal
journalctl -u k3s-agent -f
# Access service status:
systemctl status k3s-agent # For node
systemctl status k3s # for master

# Unisntall
/usr/local/bin/k3s-uninstall.sh # For master
/usr/local/bin/k3s-agent-uninstall.sh # For nodes