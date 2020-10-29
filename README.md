# assert-git-remote-ref-action

Github action to assert that HEAD (of current branch) is at the same commit as the specified remote ref.

## Usage

```
    - name: Assert Git Remote Ref
      uses: Brightspace/assert-git-remote-ref-action@master
      with:
        remote: origin
        ref: main
```

### Output

```
> git fetch --verbose origin master
POST git-upload-pack (284 bytes)
From https://github.com/Brightspace/assert-git-remote-ref-action
 * branch            master     -> FETCH_HEAD
 = [up to date]      master     -> origin/master

> git show-ref --hash --verify HEAD
3d3eb72a0787c36d78bb03336a5bc438c8d0de50

> git show-ref --hash --verify refs/remotes/origin/master
3d3eb72a0787c36d78bb03336a5bc438c8d0de50

HEAD == refs/remotes/origin/master
```