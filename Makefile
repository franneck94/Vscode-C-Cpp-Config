clean:
	rm -rf test/C/.vscode
	rm -f test/C/.clang-format
	rm -f test/C/.clang-tidy
	rm -f test/C/.editorconfig
	rm -f test/C/.gitattributes
	rm -f test/C/.gitignore
	rm -f test/C/*.exe
	rm -rf test/Cpp/.vscode
	rm -f test/Cpp/.clang-format
	rm -f test/Cpp/.clang-tidy
	rm -f test/Cpp/.editorconfig
	rm -f test/Cpp/.gitattributes
	rm -f test/Cpp/.gitignore
	rm -f test/Cpp/*.exe
	rm -rf test/C*.out
	rm -rf test/Cpp*.out
	rm -rf test/Cmake/.vscode
	rm -rf test/Cmake/tools
	rm -rf test/Cmake/.github
	rm -f test/Cmake/.clang-format
	rm -f test/Cmake/.clang-tidy
	rm -f test/Cmake/.editorconfig
	rm -f test/Cmake/.gitattributes
	rm -f test/Cmake/.gitignore
	rm -f test/Cmake/.cmake-format.yaml
	rm -f test/Cmake/.pre-commit-config.yaml

.phony: clean
