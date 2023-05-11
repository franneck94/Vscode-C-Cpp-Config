all: prepare

install_min:
	sudo apt-get install gcc g++ cmake make doxygen

install_tests: install_min
	sudo apt-get install gcovr lcov

install: install_min install_tests
	sudo apt-get install git llvm pkg-config curl zip unzip tar python3-dev clang-format clang-tidy

install_doc: install_min
	sudo apt-get install doxygen
	pip install jinja2 Pygments

prepare:
	rm -rf build
	mkdir build
