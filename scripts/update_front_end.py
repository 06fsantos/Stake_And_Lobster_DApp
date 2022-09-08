import json, yaml
import os
import shutil


def update_front_end_config():
    with open("brownie-config.yaml", "r") as conf:
        config_dict = yaml.load(conf, Loader=yaml.FullLoader)
        with open("./front_end/src/brownie-config.json", "w") as json_config:
            json.dump(config_dict, json_config)

    print("Config migrated to front end!")


def copy_folders(src, dest):
    if os.path.exists(dest):
        shutil.rmtree(dest)

    shutil.copytree(src, dest)


def main():
    update_front_end_config()
    copy_folders("./build", "./front_end/src/chain-info")
