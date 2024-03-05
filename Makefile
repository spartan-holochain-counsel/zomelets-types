.PHONY:			FORCE

ENTRY_POINT		= lib/index.js
BUILD_DEPS		= $(ENTRY_POINT) Makefile tsconfig.json
TSC_OPTIONS		= -t es2022 -m es2022	\
	--moduleResolution node			\
	--esModuleInterop			\
	--strictNullChecks			\
	--strictPropertyInitialization		\
	-d --sourceMap


#
# Building
#
tsconfig.json:
	npx tsc --init $(TSC_OPTIONS) --outDir lib
$(ENTRY_POINT):		src/*.ts Makefile
	rm -f lib/*.js
	npx tsc $(TSC_OPTIONS) --strict --outDir lib src/index.ts



#
# Repository
#
clean-remove-chaff:
	@find . -name '*~' -exec rm {} \;
clean-files:		clean-remove-chaff
	git clean -nd
clean-files-force:	clean-remove-chaff
	git clean -fd
clean-files-all:	clean-remove-chaff
	git clean -ndx
clean-files-all-force:	clean-remove-chaff
	git clean -fdx



#
# NPM packaging
#
prepare-package:
	make -s $(ENTRY_POINT)
preview-package:	clean-files prepare-package
	npm pack --dry-run .
create-package:		clean-files prepare-package
	npm pack .
publish-package:	clean-files prepare-package
	npm publish --access public .
